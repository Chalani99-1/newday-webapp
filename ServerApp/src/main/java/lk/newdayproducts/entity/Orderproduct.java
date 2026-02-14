package lk.newdayproducts.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import javax.persistence.*;
import java.math.BigDecimal;

@Entity
public class Orderproduct {
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Id
    @Column(name = "id")
    private Integer id;
    @Basic
    @Column(name = "amount")
    private Integer amount;
    @Basic
    @Column(name = "completed")
    private Integer completed;
    @Basic
    @Column(name = "expectedlinecost")
    private BigDecimal expectedlinecost;

    @ManyToOne  @JsonIgnore
    @JoinColumn(name = "clientorder_id", referencedColumnName = "id", nullable = false)
    private Clientorder clientorder;
    @ManyToOne
    @JoinColumn(name = "product_id", referencedColumnName = "id", nullable = false)
    private Product product;

    public Integer getCompleted() {
        return completed;
    }

    public void setCompleted(Integer completed) {
        this.completed = completed;
    }

    public Integer getId() {
        return id;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    public Integer getAmount() {
        return amount;
    }

    public void setAmount(Integer amount) {
        this.amount = amount;
    }

    public BigDecimal getExpectedlinecost() {
        return expectedlinecost;
    }

    public void setExpectedlinecost(BigDecimal expectedlinecost) {
        this.expectedlinecost = expectedlinecost;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        Orderproduct that = (Orderproduct) o;

        if (id != null ? !id.equals(that.id) : that.id != null) return false;
        if (amount != null ? !amount.equals(that.amount) : that.amount != null) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = id != null ? id.hashCode() : 0;
        result = 31 * result + (amount != null ? amount.hashCode() : 0);
        return result;
    }

    public Clientorder getClientorder() {
        return clientorder;
    }

    public void setClientorder(Clientorder clientorder) {
        this.clientorder = clientorder;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }
}
