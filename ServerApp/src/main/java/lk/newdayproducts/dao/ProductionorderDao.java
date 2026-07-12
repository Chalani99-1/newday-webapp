package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Clientorder;
import lk.newdayproducts.entity.Product;
import lk.newdayproducts.entity.Productionorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.sql.Timestamp;
import java.util.List;

public interface ProductionorderDao extends JpaRepository<Productionorder,Integer> {
    @Query("select po from Productionorder po where po.id=:id")
    Productionorder findByMyId(@Param("id") Integer id);

    @Query("SELECT max(p.id) FROM Productionorder  p")
    int findMaxNumber();

    @Query("select i from Productionorder i where i.ordernumber=:ordernumber")
    Product findbyNumber(@Param("ordernumber") String ordernumber);

    @Query("select i from Productionorder i where i.productionorderstatus.id!=2")
    List<Productionorder> findIncomplete();

    @Query("select i from Clientorder i where i.clientorderstatus.id!=2")
    List<Clientorder> findIncompleteCos();

//
//    @Query("select sum(i.completed) from Productionorderproduct i where i.productionorder.id=:poid ")
//    Integer findPopCompleted(@Param("poid") Integer poid);
//
//    @Query("select sum(i.amount) from Productionorderproduct i where i.productionorder.id=:poid ")
//    Integer findPopAmount(@Param("poid") Integer poid);

//    @Transactional
//    @Modifying
//    @Query("update Productionorderproduct p set p.completed =p.completed+:quantity where p.product.id = :id and p.productionorder.id=:poid")
//    void updateExistingProductQuantity(@Param("quantity") Integer quantity, @Param("id") Integer id, @Param("poid") Integer poid);

//    @Transactional
//    @Modifying
//    @Query("update Productionorderproduct p set p.completed =p.completed-:quantity where p.product.id = :id and p.productionorder.id=:poid")
//    void updateExistingProductQuantityAfterDelete(@Param("quantity") Integer quantity, @Param("id") Integer id, @Param("poid") Integer poid);
//
//    @Transactional
//    @Modifying
//    @Query("update Productionorderproduct p set p.completed = p.completed + (:newAmount - :oldAmount) where p.product.id = :id and p.productionorder.id = :poid")
//    void updateExistingProductQuantityAfterUpdate(@Param("newAmount") Integer newAmount, @Param("oldAmount") Integer oldAmount, @Param("id") Integer id, @Param("poid") Integer poid);


    @Transactional
    @Modifying
    @Query("update Productionorder po set po.productionorderstatus.id=:i where po.id=:poid" )
    void updatePOStatus(@Param("i") int i,@Param("poid") int poid);




    @Query("SELECT c FROM Productionorder c WHERE c.doplaced BETWEEN :startDate AND :endDate")
    List<Productionorder> getProductionOrdersByDate(@Param("startDate") Timestamp startTimestamp,
                                                    @Param("endDate") Timestamp endTimestamp);

    @Query(value = "SELECT * FROM productionorder WHERE id = :id", nativeQuery = true)
    Productionorder findByMyIdRefetchNative(@Param("id") Integer id);

}

