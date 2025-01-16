import ts from "typescript";
import { MetadataArrayType } from "../../../schemas/metadata/MetadataArrayType";
import { MetadataCollection } from "../../MetadataCollection";
import { MetadataFactory } from "../../MetadataFactory";
export declare const emplace_metadata_array_type: (checker: ts.TypeChecker) => (options: MetadataFactory.IOptions) => (collection: MetadataCollection) => (errors: MetadataFactory.IError[]) => (aliasType: ts.Type, arrayType: ts.Type, nullable: boolean, explore: MetadataFactory.IExplore) => MetadataArrayType;
