package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Grn;
import lk.newdayproducts.entity.Product;
import lk.newdayproducts.entity.Productionorder;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.util.List;

public interface GrnDao extends JpaRepository<Grn,Integer> {
    @Query("select g from Grn g where g.id = :id")
    Grn findByMyId(@Param("id") Integer id);

    @Query("SELECT max(g.id) FROM Grn g")
    int findMaxNumber();

    @Query("select g from Grn g where g.number=:number")
    Grn findByNumber(@Param("number")String number);

    @Query("select grn from Grn grn where grn.purchaseorder.id = :poid")
    List<Grn> findGrnsByPurchaseOrderId(@Param("poid") Integer poid);

    @Query("select  g.grnstatus.name from Grn g where g.id=:grnid")
    String getGrnStatus(@Param("grnid")Integer grnid );

    @Query("select grnrm.quantity from Grnrawmaterial grnrm where grnrm.rawmaterial.id=:id and grnrm.grn.id=:gid")
    Integer findGrnRmQuantity(@Param("id") Integer id, @Param("gid") Integer gid);

}

