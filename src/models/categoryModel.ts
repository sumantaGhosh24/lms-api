import mongoose, {Document} from "mongoose";

export interface ICategory extends Document {
  name: string;
  image: {
    public_id: string;
    url: string;
  };
  parentId?: string;
}

const categorySchema = new mongoose.Schema(
  {
    name: {type: String, required: true, trim: true, unique: true},
    image: {type: Object, required: true},
    parentId: {type: String},
  },
  {timestamps: true}
);

const Category = mongoose.model<ICategory>("Category", categorySchema);

export default Category;
