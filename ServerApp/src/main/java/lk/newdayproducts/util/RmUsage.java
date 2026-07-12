package lk.newdayproducts.util;

import java.math.BigDecimal;

public class RmUsage {
    private int id;
    private String name;
    private BigDecimal amount;
    private BigDecimal percentage;

    public RmUsage(int id, String name, BigDecimal amount, BigDecimal percentage) {
        this.id = id;
        this.name = name;
        this.amount = amount;
        this.percentage = percentage;
    }

    public RmUsage(int id, String name, BigDecimal amount) {
        this.id = id;
        this.name = name;
        this.amount = amount;
    }

    public RmUsage() {

    }

    public int getId() {
        return id;
    }

    public void setId(int id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public BigDecimal getPercentage() {
        return percentage;
    }

    public void setPercentage(BigDecimal percentage) {
        this.percentage = percentage;
    }
}
