package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientOrderCountByDate;
import lk.newdayproducts.report.entity.ExpenseOfPurchaseorderByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.sql.Timestamp;
import java.util.Date;
import java.util.List;

public interface ExpenseOfPurchaseOrderByDateDao extends JpaRepository<ExpenseOfPurchaseorderByDate,Integer> {

        @Query("SELECT new ExpenseOfPurchaseorderByDate(s.name,po.number) " +
                "FROM Purchaseorder po " +
                "JOIN po.supplier s " +
                "WHERE po.doplaced BETWEEN :startDate AND :endDate " +
                "GROUP BY po.id")
        List<ExpenseOfPurchaseorderByDate> expenseOfPurchaseorderByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


        @Query("SELECT new ExpenseOfPurchaseorderByDate (s.name,po.number) " +
                "FROM Purchaseorder po " +
                "JOIN po.supplier s " +
                "GROUP BY s.name")
        List<ExpenseOfPurchaseorderByDate> expenseOfPurchaseorderAll();
}

//@Query("SELECT p FROM Purchaseorder p WHERE p.orderDate BETWEEN :start AND :end")
//List<Purchaseorder> getExpenseOfPurchaseorderByDate(
//        @Param("start") Timestamp start,
//        @Param("end") Timestamp end