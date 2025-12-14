import mongoose from 'mongoose';
import connectMongoDatabase from '@/lib/db';
import Category from '@/models/categoryModel'; // Import Category model

class APIFunctionality {
    constructor(query, queryStr) {
        this.query = query,
        this.queryStr = queryStr
    }
    search() {
        const keyword = this.queryStr.keyword ? {
            name: {
                $regex: this.queryStr.keyword,
                $options: "i"
            }
        } : {};

        this.query = this.query.find({ ...keyword });
        return this
    }
    async filter() {
        await connectMongoDatabase();

        console.log("APIFunctionality filter called with queryStr:", this.queryStr);

        const queryCopy = { ...this.queryStr
        };
        const removeFields = ["keyword", "page", "limit", "sort", "category", "subcategory", "hasOffer"];
        removeFields.forEach(key => delete queryCopy[key]);

        let combinedFilters = {};
        let resolvedCategoryIds = [];

        // Category and Subcategory filtering
        if (this.queryStr.category) {
            console.log("Filtering by category name:", this.queryStr.category);
            const mainCategoryDoc = await Category.findOne({
                name: {
                    $regex: `^${this.queryStr.category}$`,
                    $options: 'i'
                }
            }).populate('subcategories'); // Populate subcategories to get their IDs
            
            console.log("Main Category doc found:", mainCategoryDoc ? mainCategoryDoc.name : "None");

            if (mainCategoryDoc) {
                if (this.queryStr.subcategory) { // If a specific subcategory is requested
                    console.log("Filtering by specific subcategory name:", this.queryStr.subcategory);
                    const specificSubCategoryDoc = mainCategoryDoc.subcategories.find(sub => 
                        sub.name.toLowerCase() === this.queryStr.subcategory.toLowerCase()
                    );
                    if (specificSubCategoryDoc) {
                        resolvedCategoryIds.push(specificSubCategoryDoc._id);
                    } else {
                        resolvedCategoryIds.push('000000000000000000000000'); // Non-existent ID for specific subcategory
                    }
                } else { // No specific subcategory, filter by main category and its subcategories (inclusive)
                    resolvedCategoryIds.push(mainCategoryDoc._id);
                    if (mainCategoryDoc.subcategories && mainCategoryDoc.subcategories.length > 0) {
                        mainCategoryDoc.subcategories.forEach(sub => resolvedCategoryIds.push(sub._id));
                    }
                }
            } else {
                resolvedCategoryIds.push('000000000000000000000000'); // Main category not found
            }

            if (resolvedCategoryIds.length > 0) {
                combinedFilters.category = { $in: resolvedCategoryIds };
            }
        }

        // Handle 'offer' special keyword
        if (this.queryStr.hasOffer) {
            combinedFilters.offeredPrice = { $exists: true, $ne: null };
        }

        console.log("Final combinedFilters (after category/subcategory logic):", combinedFilters);

        // Price and rating filtering
        let queryStr = JSON.stringify(queryCopy);
        queryStr = queryStr.replace(/\b(gt|gte|lt|lte)\b/g, key => `$${key}`);

        this.query = this.query.find({ ...JSON.parse(queryStr),
            ...combinedFilters
        });
        return this
    }
    pagination(resultPerPage) {
        const currentpage = Number(this.queryStr.page) || 1
        const skip = resultPerPage * (currentpage - 1);
        this.query = this.query.limit(resultPerPage).skip(skip)
        return this;
    }
    sort() {
        const sortBy = this.queryStr.sort || '-createdAt'; // Default sort by createdAt descending
        this.query = this.query.sort(sortBy);
        return this;
    }

}
export default APIFunctionality;
