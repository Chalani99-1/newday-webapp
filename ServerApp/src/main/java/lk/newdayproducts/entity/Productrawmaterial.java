package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
public class Productrawmaterial {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "quantity")
    private BigDecimal quantity;
    @Basic
    @Column(name = "linecost")
    private BigDecimal linecost;

    @ManyToOne  @JsonIgnore
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;
    @ManyToOne
    @JoinColumn(name = "rawmaterial_id", referencedColumnName = "id", nullable = false)
    private Rawmaterial rawmaterial;

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getLinecost() {
        return linecost;
    }

    public void setLinecost(BigDecimal linecost) {
        this.linecost = linecost;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Productrawmaterial that = (Productrawmaterial) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (quantity != null ? !quantity.equals(that.quantity) : that.quantity != null) return false;
        if (linecost != null ? !linecost.equals(that.linecost) : that.linecost != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (quantity != null ? quantity.hashCode() : 0);
        result = 31 * result + (linecost != null ? linecost.hashCode() : 0);
        return result;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Rawmaterial getRawmaterial() {
        return rawmaterial;
    }

    public void setRawmaterial(Rawmaterial rawmaterial) {
        this.rawmaterial = rawmaterial;
    }
}
