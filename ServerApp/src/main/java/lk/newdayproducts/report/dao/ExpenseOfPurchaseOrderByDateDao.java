package lk.newdayproducts.report.dao;

import lk.newdayproducts.entity.Purchaseorder;
import lk.newdayproducts.report.entity.ClientOrderCountByDate;
import lk.newdayproducts.report.entity.ExpenseOfPurchaseorderByDate;
import lk.newdayproducts.report.entity.PurchaseOrderCountByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public interface ExpenseOfPurchaseOrderByDateDao extends JpaRepository<ExpenseOfPurchaseorderByDate,Integer> {

//        @Query("SELECT c FROM Purchaseorder c WHERE c.doplaced BETWEEN :startDate AND :endDate")
//        List<Purchaseorder> getPurchaseOrderExpectedByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


//        @Query("SELECT new ExpenseOfPurchaseorderByDate (p.number,s.name,p.expectedtotal) " +
//                "FROM Purchaseorder p " +
//                "JOIN p.supplier s " +
//                "WHERE p.doplaced BETWEEN :startDate AND :endDate " +
//                "GROUP BY s.name")
//        List<ExpenseOfPurchaseorderByDate> expenseofpurchaseOrderByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


//        @Query("SELECT new ExpenseOfPurchaseorderByDate(s.name,po.number) " +
//                "FROM Purchaseorder po " +
//                "JOIN po.supplier s " +
//                "WHERE po.doplaced BETWEEN :startDate AND :endDate " +
//                "GROUP BY po.id")
//        List<ExpenseOfPurchaseorderByDate> expenseOfPurchaseorderByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


//        @Query("SELECT po.number,po.supplier.name,po.expectedtotal FROM Purchaseorder po ")
//        List<Purchaseorder> getPurchaseOrderExpectedAll();

        @Query("SELECT new ExpenseOfPurchaseorderByDate (po.number, s.name, po.expectedtotal) " +
                "FROM Purchaseorder po " +
                "JOIN po.supplier s " +
                "WHERE po.doplaced BETWEEN :startDate AND :endDate ")
        List<ExpenseOfPurchaseorderByDate> expenseOfPurchaseorderByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);

        @Query("SELECT new ExpenseOfPurchaseorderByDate (po.number, s.name, po.expectedtotal) " +
                "FROM Purchaseorder po " +
                "JOIN po.supplier s " )
        List<ExpenseOfPurchaseorderByDate> expenseOfPurchaseorderAll();
}
