package lk.newdayproducts.report.dao;

import lk.newdayproducts.report.entity.ClientCountByState;
import lk.newdayproducts.report.entity.PurchaseOrderVsRawMaterials;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PurchaseOrderVsRawmaterialDao extends JpaRepository<PurchaseOrderVsRawMaterials, Integer> {
    @Query("SELECT new PurchaseOrderVsRawMaterials(p.number,r.name,po.quentity,po.receivedamount) " +
            "FROM Poitem po,Rawmaterial r,Purchaseorder p " +
            "WHERE p.id=po.purchaseorder.id " +
            "AND r.id=po.rawmaterial.id " +
            "AND p.postatus.id!=3 ")
        List<PurchaseOrderVsRawMaterials> getPurchaseOrderVsRawMaterials();
        
}
