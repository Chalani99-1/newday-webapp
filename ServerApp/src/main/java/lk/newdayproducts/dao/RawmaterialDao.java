package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Employee;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RawmaterialDao extends JpaRepository<Rawmaterial,Integer> {

    @Query("select r from Rawmaterial r where r.id = :id")
    Rawmaterial findByMyId(@Param("id") Integer id);

    @Query("select r from Rawmaterial r where r.code=:code")
    Rawmaterial findByCode(@Param("code")String id);

    @Query("select  max(rm.id) from Rawmaterial rm")
    int findMaxNumber();

}

