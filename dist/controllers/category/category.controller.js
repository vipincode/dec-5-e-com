"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.getCategory = exports.getAllCategory = exports.createCategory = void 0;
const category_model_1 = __importDefault(require("@models/category.model"));
const createCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryData = req.body;
    const category = yield category_model_1.default.create({
        name: categoryData.name,
        icon: categoryData.icon,
        color: categoryData.color,
    });
    res.status(201).send({ data: category });
});
exports.createCategory = createCategory;
const getAllCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const categoryList = yield category_model_1.default.find();
    if (!categoryList) {
        res.status(500).json({ success: false });
    }
    res.status(200).send({ data: categoryList });
});
exports.getAllCategory = getAllCategory;
const getCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findById(req.params.id);
    if (!category) {
        res.status(500).json({ message: 'Category with given id was not found.' });
    }
    res.status(200).send({ data: category });
});
exports.getCategory = getCategory;
const updateCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findByIdAndUpdate(req.params.id, {
        name: req.body.name,
        icon: req.body.name,
        color: req.body.color,
    }, { new: true });
    if (!category) {
        res.status(500).json({ message: 'Category cannot be created.' });
    }
    res.status(200).send({ data: category });
});
exports.updateCategory = updateCategory;
const deleteCategory = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const category = yield category_model_1.default.findByIdAndDelete(req.params.id);
    if (!category) {
        res.status(500).send({ success: false });
    }
    res.send({ message: 'Category deleted!' });
});
exports.deleteCategory = deleteCategory;
