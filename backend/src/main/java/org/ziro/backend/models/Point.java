package org.ziro.backend.models;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;

@Entity
public class Point {
    @Id
    @GeneratedValue(strategy=GenerationType.IDENTITY)
    private Long id;
    private double x;
    private double y;
    private double r;
    public boolean isHit;
    public String startTime;
    public double executionTime;
    public String creator;

    public Point() {}

    public Point(double x, double y, double r, boolean isHit, String startTime, double executionTime, String creator) {
        this.x = x;
        this.y = y;
        this.r = r;
        this.isHit = isHit;
        this.startTime = startTime;
        this.executionTime = executionTime;
        this.creator = creator;
    }

    public double getX() {
        return x;
    }
    public void setX(double x) {
        this.x = x;
    }
    public double getY() {
        return y;
    }
    public void setY(double y) {
        this.y = y;
    }
    public double getR() {
        return r;
    }
    public void setR(double r) {
        this.r = r;
    }
    public Long getId() {
        return id;
    }
    public void setId(long id) {
        this.id = id;
    }


}
