package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.ExpenseOfPurchaseorderByDate;
import lk.newdayproducts.report.entity.ProfitByOrderByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ProfitByOrderByDateDao extends JpaRepository<ProfitByOrderByDate, Integer> {


//        @Query("SELECT new ProfitByOrderByDate (c.name,co.number,co.expectedtotal) " +
//                "FROM Clientorder co,Client as c" )
//        List<ProfitByOrderByDate> profitByOrderByDateAll();
        
}
