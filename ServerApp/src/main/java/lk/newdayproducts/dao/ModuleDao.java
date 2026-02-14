package lk.newdayproducts.dao;

import lk.newdayproducts.entity.Module;
import org.springframework.data.jpa.repository.JpaRepository;


public interface ModuleDao extends JpaRepository<Module,Integer> {
}
