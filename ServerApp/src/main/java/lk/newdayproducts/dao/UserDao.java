package lk.newdayproducts.dao;


import lk.newdayproducts.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;


public interface UserDao extends JpaRepository<User,Integer> {
    User findByUsername(String username);

    @Query("select u from User u where u.id=:id")
    User findByMyId(@Param("id") Integer integer);
}
