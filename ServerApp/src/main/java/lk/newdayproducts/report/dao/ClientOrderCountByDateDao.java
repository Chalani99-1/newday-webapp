package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientOrderCountByDate;
import lk.newdayproducts.report.entity.ProductionOrderCountByDate;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ClientOrderCountByDateDao extends JpaRepository<ClientOrderCountByDate,Integer> {

        @Query("SELECT new ClientOrderCountByDate (c.name, COUNT(c.name)) " +
                "FROM Clientorder co " +
                "JOIN co.client c " +
                "WHERE co.doplaced BETWEEN :startDate AND :endDate " +
                "GROUP BY c.name")
        List<ClientOrderCountByDate> clientOrderCountByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);


        @Query("SELECT new ClientOrderCountByDate (c.name, COUNT(c.name)) " +
                "FROM Clientorder co " +
                "JOIN co.client c " +
                "GROUP BY c.name")
        List<ClientOrderCountByDate> clientOrderCountByDateAll();
}

