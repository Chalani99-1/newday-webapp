package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Purchaseorder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface PurchaseorderDao extends JpaRepository<Purchaseorder,Integer> {

}

