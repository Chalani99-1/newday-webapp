package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Grn;
import lk.newdayproducts.entity.Purchaseorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface PurchaseorderDao extends JpaRepository<Purchaseorder,Integer> {

    @Query("select po from Purchaseorder po where po.id=:id")
    Purchaseorder findByMyId(@Param("id") Integer id);

    @Query("SELECT max(p.id) FROM Purchaseorder  p")
    int findMaxNumber();

    @Query("select i from Purchaseorder i where i.number=:number")
    Purchaseorder findbyNumber(@Param("number") String number);

    @Transactional
    @Modifying
    @Query("update Purchaseorder p set p.paid=:paid where p.id=:poid")
    void updatePaid(@Param("paid") int i, @Param("poid") Integer poid);

   //update the status of a purchase order in the database.
    @Transactional
    @Modifying
    @Query("update Purchaseorder p set p.postatus.id=:id where p.id=:poid")
    void updateCompleted(@Param("id") int id, @Param("poid") int poid);

    @Transactional
    @Modifying
    @Query("update Poitem p set p.receivedamount =p.receivedamount+:quantity where p.rawmaterial.id = :id and p.purchaseorder.id=:poid")
    void updateExistingRMQuantity(@Param("quantity") Integer quantity, @Param("id") Integer id, @Param("poid") Integer poid);

    @Query("select sum(i.receivedamount) from Poitem i where i.purchaseorder.id=:poid ")
    Integer findPOItemRMreceived(@Param("poid") Integer poid);

    @Query("select sum(i.quentity) from Poitem i where i.purchaseorder.id=:poid ")
    Integer findPOItemRmQuantity(@Param("poid") Integer poid);

    @Query("select p.receivedpercentage from Purchaseorder p where p.id=:id")
    BigDecimal getReceivedPercentage(@Param("id") int id);
    @Transactional
    @Modifying
    @Query("update Purchaseorder p set p.receivedpercentage =:percentage where  p.id=:poid")
    void updateReceivedPercentage(@Param("percentage") BigDecimal percentage, @Param("poid") Integer poid);

    @Transactional
    @Modifying
    @Query("update Purchaseorder i set i.postatus.id=:id where i.id=:pid")
    void updatePOStatus(@Param("id") Integer id, @Param("pid") Integer pid);
}

