import { TypeMovement} from "@prisma/client";
import { Timestamp } from "rxjs";

export interface CreateStockMovementDto {

//Les relations
    userId: number;
    siteId: number;
    productId: number;
    productBatchNumberId:number;
//  Les données de l'objet 
    type: TypeMovement;
    createdAt: Date;
    quantity: number

}
