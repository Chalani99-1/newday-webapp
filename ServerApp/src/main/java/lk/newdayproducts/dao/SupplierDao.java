package lk.newdayproducts.dao;

import lk.newdayproducts.dto.SupAndMatCatCount;
import lk.newdayproducts.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    @Query("select s from Supplier s where s.name=:name")
    Supplier findByName(@Param("name")String id);

    @Query("select r from Supplier r where r.id = :id")
    Supplier findByMyId(@Param("id") Integer id);

    @Query("select new SupAndMatCatCount(s.name,count(smc.id) ) from Supplier s ,Suppliermaterialcategory smc where s.id=smc.supplier.id group by s.id")
    List<SupAndMatCatCount> findSupAndMatCatCount();


}

