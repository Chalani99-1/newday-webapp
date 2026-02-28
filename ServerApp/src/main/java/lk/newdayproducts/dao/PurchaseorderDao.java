package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Purchaseorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface PurchaseorderDao extends JpaRepository<Purchaseorder,Integer> {

    @Query("select po from Purchaseorder po where po.id=:id")
    Purchaseorder findByMyId(@Param("id") Integer id);

    @Query("SELECT max(p.id) FROM Purchaseorder  p")
    int findMaxNumber();

    @Query("select i from Purchaseorder i where i.number=:number")
    Purchaseorder findbyNumber(@Param("number") String number);
}

