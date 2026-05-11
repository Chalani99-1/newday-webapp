package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ProductionOrderCountByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ProductionOrderCountByDateDao extends JpaRepository<ProductionOrderCountByDate,Integer> {

        @Query("SELECT new ProductionOrderCountByDate(pos.name, COUNT(p.id)) " +
                "FROM Productionorder p " +
                "JOIN p.productionorderstatus pos " +
                "WHERE p.doplaced BETWEEN :startDate AND :endDate " +
                "GROUP BY pos.name")
        List<ProductionOrderCountByDate> productionOrderCountByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


        @Query("SELECT new ProductionOrderCountByDate(pos.name, COUNT(p.id)) " +
                "FROM Productionorder p " +
                "JOIN p.productionorderstatus pos " +
                "GROUP BY pos.name")
        List<ProductionOrderCountByDate> productionOrderCountByDateAll();
}

//        @Query
//        ("SELECT new ProductionOrderCountByDate (pos.name, COUNT(pos.name))
//        FROM Productionorder p, Productionorderstatus pos
//        WHERE pos.id = p.productionorderstatus.id BETWEEN :startDate AND :endDate
//        GROUP BY pos.name")
//        List<Productionorderstatus> countProductionorderCountByDate();
