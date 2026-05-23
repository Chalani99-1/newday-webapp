package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.PurchaseOrderVsRawMaterials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderVsRawmaterialDao extends JpaRepository<PurchaseOrderVsRawMaterials, Integer> {

//        @Query("SELECT new PurchaseOrderVsRawMaterials (po.ordernumber,p.code,p.name,pop.amount,po.productionorderstatus.name) " +
//                "FROM Poitem poi,Purchaseorder p,Rawmaterial r" +
//                "WHERE  " +
//                "AND p.id=pop.product.id")
//        List<ClientCountByState> countClientCountByState();
        
}
