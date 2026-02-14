package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Supplier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface SupplierDao extends JpaRepository<Supplier,Integer> {

    @Query("select s from Supplier s where s.name=:name")
    Supplier findByName(@Param("name")String id);

    @Query("select r from Rawmaterial r where r.id = :id")
    Supplier findByMyId(@Param("id") Integer id);
}

