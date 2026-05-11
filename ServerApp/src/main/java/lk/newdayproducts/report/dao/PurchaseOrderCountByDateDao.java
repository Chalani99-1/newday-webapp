package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ProductionOrderCountByDate;
import lk.newdayproducts.report.entity.PurchaseOrderCountByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface PurchaseOrderCountByDateDao extends JpaRepository<PurchaseOrderCountByDate,Integer> {

        @Query("SELECT new PurchaseOrderCountByDate (s.name, COUNT(p.id)) " +
                "FROM Purchaseorder p " +
                "JOIN p.supplier s " +
                "WHERE p.doplaced BETWEEN :startDate AND :endDate " +
                "GROUP BY s.name")
        List<PurchaseOrderCountByDate> purchaseOrderCountByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


        @Query("SELECT new PurchaseOrderCountByDate (s.name, COUNT(p.id)) " +
                "FROM Purchaseorder p " +
                "JOIN p.supplier s " +
                "GROUP BY s.name")
        List<PurchaseOrderCountByDate> purchaseOrderCountByDateAll();
}


//        @Query
//        ("SELECT new ProductionOrderCountByDate (pos.name, COUNT(pos.name))
//        FROM Productionorder p, Productionorderstatus pos
//        WHERE pos.id = p.productionorderstatus.id BETWEEN :startDate AND :endDate
//        GROUP BY pos.name")
//        List<Productionorderstatus> countProductionorderCountByDate();
