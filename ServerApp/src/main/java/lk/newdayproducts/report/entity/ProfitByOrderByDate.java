package lk.newdayproducts.report.entity;

import javax.persistence.Entity;
import javax.persistence.Id;
import java.math.BigDecimal;

@Entity
public class ProfitByOrderByDate {

    private Integer id;
    private String clientOrderNumber;
    private String clientName;
    private BigDecimal revenue;
    private BigDecimal expense;
    private BigDecimal profit;

    public ProfitByOrderByDate() {  }

    public String getClientOrderNumber() {
        return clientOrderNumber;
    }

    public String getClientName() {
        return clientName;
    }

    public void setClientName(String clientName) {
        this.clientName = clientName;
    }

    public void setClientOrderNumber(String clientOrderNumber) {
        this.clientOrderNumber = clientOrderNumber;
    }

    public BigDecimal getProfit() {
        return profit;
    }

    public void setProfit(BigDecimal profit) {
        this.profit = profit;
    }

    public BigDecimal getRevenue() {
        return revenue;
    }

    public void setRevenue(BigDecimal revenue) {
        this.revenue = revenue;
    }

    public BigDecimal getExpense() {
        return expense;
    }

    public void setExpense(BigDecimal expense) {
        this.expense = expense;
    }

    public ProfitByOrderByDate(String clientOrderNumber, String clientName, BigDecimal revenue, BigDecimal expense, BigDecimal profit) {
        this.clientOrderNumber = clientOrderNumber;
        this.clientName = clientName;
        this.revenue = revenue;
        this.expense = expense;
        this.profit = profit;
    }

    public void setId(Integer id) {
        this.id = id;
    }

    @Id
    public Integer getId() {
        return id;
    }


}
