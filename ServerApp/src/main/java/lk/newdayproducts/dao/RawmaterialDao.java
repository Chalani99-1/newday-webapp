package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Employee;
import lk.newdayproducts.entity.Rawmaterial;
import lk.newdayproducts.report.entity.RawMatCount;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;

public interface RawmaterialDao extends JpaRepository<Rawmaterial,Integer> {

    @Query("select r from Rawmaterial r where r.id = :id")
    Rawmaterial findByMyId(@Param("id") Integer id);

    @Query("select r from Rawmaterial r where r.code=:code")
    Rawmaterial findByCode(@Param("code")String id);

    @Query("select  max(rm.id) from Rawmaterial rm")
    int findMaxNumber();

    @Query("select i from Rawmaterial i where i.qoh <=i.rop")
    List<Rawmaterial> findOutOfStock();

    @Transactional
    @Modifying
    @Query("update Rawmaterial r set r.qoh =r.qoh+:quantity where r.id = :id")
    void updateRawMaterialQuantityAfterGrn(@Param("quantity") BigDecimal quantity, @Param("id") Integer id);

    @Transactional
    @Modifying
    @Query("update Rawmaterial r set r.resourcelimit =:updatedResourceLimit where r.id = :id")
    void updateRawMaterialResourceLimitAfterGrn(@Param("updatedResourceLimit") String updatedResourceLimit, @Param("id") Integer id);

    @Query("select i.rop from Rawmaterial i where i.id=:id")
    BigDecimal findROPByMyId(@Param("id") Integer id);

    @Query("select i.qoh from Rawmaterial i where i.id=:id")
    BigDecimal findQOHByMyId(@Param("id") Integer id);

    @Transactional
    @Modifying
    @Query("update Rawmaterial r set r.qoh =r.qoh-:quantity where r.id = :id")
    void updateRawMaterialQuantity(@Param("quantity") BigDecimal quantity, @Param("id") Integer id);

    @Transactional
    @Modifying
    @Query("UPDATE Rawmaterial rm set rm.resourcelimit =:newRl where rm.id=:rmId")
    void updateRlAfterProduction( @Param("newRl") String newRl,@Param("rmId") Integer rmId);

    @Transactional
    @Modifying
    @Query("UPDATE Rawmaterial rm set rm.materialstatus.id =:msId where rm.id=:rmId")
    void updateRmStatusAfter(@Param("rmId")Integer rmId, @Param("msId") int msId);

    @Transactional
    @Modifying
    @Query("update Rawmaterial r set r.qoh =r.qoh+:quantity where r.id = :id")
    void updateRawMaterialQuantityAfterUpdate(@Param("quantity") BigDecimal quantity, @Param("id") Integer id);

    @Transactional
    @Modifying
    @Query("update Rawmaterial r set r.qoh =r.qoh+:quantity where r.id = :id")
    void updateRawMaterialQuantityAfterDelete(@Param("quantity") BigDecimal quantity, @Param("id") Integer id);


    //dashboard
    @Query("SELECT new RawMatCount (r.name, r.qoh,r.rop) " +
           "FROM Rawmaterial r")
    List<RawMatCount> rawMatCount();
}

