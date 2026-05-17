package lk.newdayproducts.report.dao;

import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.ClientOrderVsProducts;
import lk.newdayproducts.report.entity.ProfitByOrderByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ProfitByOrderByDateDao extends JpaRepository<ProfitByOrderByDate, Integer> {

//        @Query("SELECT new ClientOrderVsProducts(co.number, p.name, op.amount, op.completed) " +
//                "FROM Orderproduct op " +
//                "JOIN op.clientorder co " +
//                "JOIN op.product p " +
//                "WHERE co.doplaced BETWEEN :startDate AND :endDate")
//        List<ClientOrderVsProducts> clientOrderVsProductsdate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

        @Query("SELECT new ProfitByOrderByDate (co.number, co.client.name, co.expectedtotal) " +
                "FROM Orderproduct op " +
                "JOIN op.clientorder co " +
                "JOIN op.product p " +
                "WHERE co.doplaced BETWEEN :startDate AND :endDate")
        List<Clientorder> ProfitByOrderByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
        @Query
        ("SELECT new ProfitByOrderByDate (co.number,co.client.name,co.expectedtotal) " +
                "FROM Orderproduct op,Clientorder co,Product p " +
                "WHERE co.id=op.clientorder.id " +
                "AND p.id=op.product.id")
        List<ProfitByOrderByDate> profitByOrderByDateAll();
        
}
