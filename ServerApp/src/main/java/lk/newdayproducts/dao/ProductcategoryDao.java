package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Productcategory;
import lk.newdayproducts.entity.Rawmaterial;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface ProductcategoryDao extends JpaRepository<Productcategory,Integer> {
    @Query("select p from Productcategory p where p.id = :id")
    Productcategory findByMyId(@Param("id") Integer id);
}

