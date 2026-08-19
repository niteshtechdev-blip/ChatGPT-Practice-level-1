import { ProductModal } from "../models/product.model.js";

export const home = async (req, res) => {
  res.send("I am product home");
};

// -------ADD PRODUCT-----------

export const productAdd = async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      rating,
      isAvailable,
    } = req.body;
    const data = await ProductModal.create({
      name,
      description,
      price,
      discount,
      category,
      brand,
      stock,
      rating,
      isAvailable,
    });
    if (!data) {
      return console.log("Error in product add");
    }
    res.status(200).json({
      success: true,
      message: "Product add success",
      Product: data,
    });
  } catch (error) {
    console.log(`Error in product add ${error.message}`);
    res.status(400).json({
      success: false,
      message: "Product add Failed",
    });
  }
};

// ---------READ All PRODUCTS----------

export const productReadAll = async (req, res) => {
  try {
    const data = await ProductModal.find().select("-createdAt -updatedAt -__v");
    if (!data) {
      return res.status(404).json({
        success: false,
        message: "No data Found",
      });
    }
    console.log("All data retrived");
    res.status(200).json({
      success: true,
      message: "Data Retrive successfully",
      Data: data,
    });
  } catch (error) {
    console.log(`Error in data retrive ${error.message}`);
    res.status(404).json({
      success: false,
      message: "Data Retrive Failed",
    });
  }
};

// -------------Read One By Id------------

export const productReadOne = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModal.find({ _id: id });
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "No Product found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Product retrive success",
      Product: product,
    });
  } catch (error) {
    console.log(`Error in product access by id. Error:${error.message}`);
    res.status(300).json({
      success: false,
      message: "Product retrive Failed",
    });
  }
};

// -----------Update-----------

export const productUpdate = async (req, res) => {
  const id = req.params.id;
  const product = await ProductModal.find({ _id: id });
  if (!product) {
    console.log(`No product found`);
    return res.status(404).json({
      success: false,
      message: "No Product Found To update",
    });
  }
  const {
    name,
    description,
    price,
    discount,
    category,
    brand,
    stock,
    rating,
    isAvailable,
  } = req.body;
  const updateObj = {};
  if (name) updateObj["name"] = name;
  if (description) updateObj["description"] = description;
  if (price) updateObj["price"] = price;
  if (discount) updateObj["discount"] = discount;
  if (category) updateObj["category"] = category;
  if (brand) updateObj["brand"] = brand;
  if (stock) updateObj["stock"] = stock;
  if (rating) updateObj["rating"] = rating;
  if (isAvailable) updateObj["isAvailable"] = isAvailable;
  const updatedProduct = await ProductModal.findByIdAndUpdate(id, updateObj);
  if (!updatedProduct) {
    console.log(`product Can't Update`);
    return res.status(400).json({
      success: false,
      message: "Product Not Updated",
    });
  }
  res.status(200).json({
    success: true,
    message: "Product Updated Successfully",
    Updated_Product: updatedProduct,
  });
};

// ------------Delete----------

export const productDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const product = await ProductModal.findByIdAndDelete(id);
    if (!product) {
      console.log(`Product Delete Failed`);
      return res.status(300).json({
        success: false,
        message: `Product Can't delete`,
      });
    }
    res.status(200).json({
      success: true,
      message: `Product deleted Successfully`,
      deleted_product: product,
    });
  } catch (error) {
    console.log(`Error While Product Deletion:${error.message}`)
    res.status(400).json({
      success: false,
      message: `Product delete Failed`,
    });
  }
};

