package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.entity.Product;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Date;
import java.util.List;

public interface ClientorderDao extends JpaRepository<Clientorder,Integer> {

    @Query("select co from Clientorder co where co.id = :id")
    Clientorder findByMyId(@Param("id") Integer id);

    @Query("select co from Clientorder co where co.number=:number")
    Clientorder findbyNumber(@Param("number") String number);

    @Query("SELECT max(p.id) FROM Clientorder  p")
    int findMaxNumber();

    @Query("SELECT  c FROM Clientorder c WHERE c.doplaced BETWEEN :startDate AND :endDate ")
    List<Clientorder> getClientOrderByDate(@Param("startDate") Date startDate, @Param("endDate") Date endDate);
    @Query("SELECT CONCAT(co.number, ' - of Client - ', co.client.name) FROM Clientorder co WHERE co.clientorderstatus.id!=2")
    List<String> findIncomplete();
}


