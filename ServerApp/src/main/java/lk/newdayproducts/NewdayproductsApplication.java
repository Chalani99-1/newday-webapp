package lk.newdayproducts;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.security.servlet.SecurityAutoConfiguration;

@SpringBootApplication(exclude = { SecurityAutoConfiguration.class })
public class NewdayproductsApplication {

	public static void main(String[] args) {
		SpringApplication.run(NewdayproductsApplication.class, args);
	}

}
