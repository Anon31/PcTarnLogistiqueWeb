import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma, TypeMovement } from '@prisma/client';
import { CreateStockMovementDto } from './dto/create-stock-movement.dto';
import { PrismaService } from '../../prisma/prisma.service';
import { isDefined } from 'class-validator';

const stockMovementRelations = {
  productBatchNumber: true,
  site: true,
  product: true,
} satisfies Prisma.StockMovementInclude;



@Injectable()
export class StockMovementService {
  constructor(private readonly prisma: PrismaService) {}
async create(createStockMovementDto: CreateStockMovementDto) {
  return this.prisma.$transaction(async (tx) => {

    const newStockMovement = await tx.stockMovement.create({
      data: createStockMovementDto,

    });
    const condition = {
            siteId:newStockMovement.siteId,
            productId:newStockMovement.productId,
            ProductBatchNumberId:newStockMovement.productBatchNumberId
          }

  switch (newStockMovement.type) {
    case TypeMovement.INPUT:
      await tx.stock.updateMany({
        where: condition,
        data: {
          quantity: {
            increment: newStockMovement.quantity,
          },
        },
      });
      break;

    case TypeMovement.OUTPUT:
        let stockQuantity = -1

        await tx.stock.findFirst({
          where:condition
        }).then(data => {
          if (data) {
            stockQuantity = isDefined(data.quantity)? data.quantity : -1
            
          }
        })

        if(stockQuantity && stockQuantity > 0){
          await tx.stock.updateMany({
            where: condition,
            data: {
              quantity: {
                decrement: newStockMovement.quantity,
              },
            },
          });
       }else{
        return new BadRequestException('le stock est déjà vide')
       }


      break;
  }
  let stock = tx.stock.findFirst({
    where:condition
    
  })
    return stock
  });
}

  findAll() {
    const stockMovements = this.prisma.stockMovement.findMany({
      orderBy: { createdAt: 'desc' },
      include:{
          productBatchNumber: true,
          site: true,
          product: true,
      }
    });
    return stockMovements;
  }

  findOne(id: number) {

    const stockMovements = this.prisma.stockMovement.findFirst({
      where: {
        id: id,
      },
      include: stockMovementRelations,
    });
    return stockMovements;  
  }

  // Utilisé pour recuperer l'historique des mouvements de stock d'un site
  findAllBySite(siteId: number) {
  
    const stockMovements = this.prisma.stockMovement.findMany({
      where: {
        siteId: siteId,
      },
      include: stockMovementRelations,
      orderBy: { id: 'asc' },
    });
    return stockMovements;  
  }

  findLastBySite(siteId: number) {

    const stockMovements = this.prisma.stockMovement.findFirst({
      where: {
        siteId: siteId,
      },
      include: stockMovementRelations,
      orderBy: {
        createdAt: 'desc',
      },
      take: 1,
    });
    return stockMovements;  
  }


  // Nous partons du principe qu'un mouvement de stock ne peut en aucun cas 
  // être supprimé ou modifié pour l'intégrité de l'historique des entrés et sorties du stock
  // update(id: number, updateStockMovementDto: UpdateStockMovementDto) {

  //   return `This action updates a #${id} stockMovement`;
  // }

  // remove(id: number) {

  //   return `This action removes a #${id} stockMovement`;
  // }
}
