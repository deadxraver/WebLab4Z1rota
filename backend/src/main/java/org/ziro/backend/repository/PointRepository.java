package org.ziro.backend.repository;

import jakarta.ejb.Stateless;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import jakarta.persistence.TypedQuery;
import org.ziro.backend.models.Point;

import java.util.List;


@Stateless
public class PointRepository {

    @PersistenceContext
    private EntityManager entityManager;

    public Point save(Point point) {
        if (point.getId() == null || point.getId() == 0) {
            entityManager.persist(point);
            return point;
        } else {
            return entityManager.merge(point);
        }
    }

    public List<Point> findAllByCreator(String creator) {
        TypedQuery<Point> query = entityManager.createQuery(
                "SELECT p FROM Point p WHERE p.creator = :creator", Point.class);
        query.setParameter("creator", creator);
        return query.getResultList();
    }

    public List<Point> findAll() {
        TypedQuery<Point> query = entityManager.createQuery("SELECT p FROM Point p", Point.class);
        return query.getResultList();
    }
    public int deleteAllByCreator(String creator) {
        Query query = entityManager.createQuery(
                "DELETE FROM Point p WHERE p.creator = :creator");
        query.setParameter("creator", creator);
        return query.executeUpdate();
    }




}