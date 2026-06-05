package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ProductionVsAmount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProductionVsAmountDao extends JpaRepository<ProductionVsAmount, Integer> {
//        @Query("SELECT new ProductionVsAmount (po.ordernumber,p.code,p.name,pop.amount,po.productionorderstatus.name) " +
//                "FROM Productionorderproduct pop,Productionorder po,Product p " +
//                "WHERE po.id=pop.productionorder.id " +
//                "AND p.id=pop.product.id")
//        List<ProductionVsAmount> productionVsAmount();
        
}
