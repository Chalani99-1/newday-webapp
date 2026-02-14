package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;

@Entity
public class ProductCountByCategory {

    @Id
    private Integer id;
    private String categoryName;
    private Long count;
    private double percentage;

    public ProductCountByCategory() {
    }

    public ProductCountByCategory(String categoryName, Long count) {
        this.categoryName = categoryName;
        this.count = count;
    }


    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public Long getCount() {
        return count;
    }

    public void setCount(Long count) {
        this.count = count;
    }
    public double getPercentage() {
        return percentage;
    }
    public void setPercentage(double percentage) {
        this.percentage = percentage;
    }
}
