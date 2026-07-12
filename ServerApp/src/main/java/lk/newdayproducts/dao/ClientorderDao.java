package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.entity.Product;
import lk.newdayproducts.report.entity.ClientOrderCompletion;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
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



    @Query("select sum(i.completed) from Orderproduct i where i.clientorder.id=:poid ")
    Integer findOpCompleted(@Param("poid") Integer poid);

    @Query("select sum(i.amount) from Orderproduct i where i.clientorder.id=:poid ")
    Integer findOpAmount(@Param("poid") Integer poid);

    @Transactional
    @Modifying
    @Query("update Clientorder p set p.completepercentage =:percentage where  p.id=:poid")
    void updatePercentage(@Param("percentage") String percentage, @Param("poid") Integer poid);

    @Transactional
    @Modifying
    @Query("update Clientorder co set co.clientorderstatus.id=:i where co.id=:poid")
    void updateCOStatus(@Param("i") int i,@Param("poid")int poid);

    @Transactional
    @Modifying
    @Query("update Orderproduct o set o.completed =o.completed+:quantity where o.product.id = :id and o.clientorder.id=:coid")
    void updateExistingProductQuantity(@Param("quantity") Integer quantity, @Param("id") Integer id, @Param("coid") Integer coid);

    @Transactional
    @Modifying
    @Query("update Orderproduct o set o.completed =o.completed-:quantity where o.product.id = :id and o.clientorder.id=:coid")
    void updateExistingProductQuantityAfterDelete(@Param("quantity") Integer quantity, @Param("id") Integer id, @Param("coid") Integer coid);

    @Transactional
    @Modifying
    @Query("update Orderproduct o set o.completed =o.completed+ (:newAmount - :oldAmount) where o.product.id = :id and o.clientorder.id=:coid")
    void updateExistingProductQuantityAfterUpdate(@Param("newAmount") Integer newAmount, @Param("oldAmount") Integer oldAmount, @Param("id") Integer id, @Param("coid") Integer coid);

    @Query("select po.completepercentage from Clientorder po where po.id =:id")
    BigDecimal getComletedPercentage(@Param("id")int id);


//for dashboard
    @Query("SELECT new ClientOrderCompletion (co.id,co.number,co.completepercentage) FROM Clientorder co " )
    List<ClientOrderCompletion> clientOrderCompletion();

}


