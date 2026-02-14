package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Materialcategory;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface MaterialcategoryDao extends JpaRepository<Materialcategory,Integer> {

    @Query("select c from Materialcategory c where c.name=:name")
    Materialcategory findByName(@Param("name") String name);

    @Query("select i from Materialcategory i where i.id=:id")
    Materialcategory findByMyId(@Param("id") Integer id);
}

