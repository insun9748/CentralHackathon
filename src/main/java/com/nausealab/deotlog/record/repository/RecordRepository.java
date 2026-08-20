package com.nausealab.deotlog.record.repository;

import com.nausealab.deotlog.record.entity.Record;
import com.nausealab.deotlog.record.entity.RecordStatus;
import com.nausealab.deotlog.user.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface RecordRepository extends JpaRepository<Record, Long> {

    @Query("""
        SELECT r
        FROM Record r
        LEFT JOIN FETCH r.aiAnalysis
        WHERE r.user = :user
        ORDER BY r.recordDateTime DESC
        """)
    List<Record> findByUserOrderByRecordDateTimeDesc(
            @Param("user") User user
    );

    @Query("""
        SELECT r
        FROM Record r
        LEFT JOIN FETCH r.aiAnalysis
        WHERE r.user = :user
          AND r.recordDateTime >= :start
          AND r.recordDateTime < :end
        ORDER BY r.recordDateTime DESC
        """)
    List<Record> findByUserAndRecordDateTimeBetween(
            @Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    @Query("""
        SELECT r
        FROM Record r
        LEFT JOIN FETCH r.aiAnalysis
        WHERE r.recordId = :recordId
          AND r.user = :user
        """)
    Optional<Record> findByRecordIdAndUser(
            @Param("recordId") Long recordId,
            @Param("user") User user
    );

    @Query("""
        SELECT r
        FROM Record r
        LEFT JOIN FETCH r.aiAnalysis
        WHERE r.user = :user
          AND r.status = :status
          AND r.recordDateTime >= :startDateTime
          AND r.recordDateTime < :endDateTime
        """)
    List<Record> findRecordsForReport(
            @Param("user") User user,
            @Param("status") RecordStatus status,
            @Param("startDateTime") LocalDateTime startDateTime,
            @Param("endDateTime") LocalDateTime endDateTime
    );

    @Query("""
        SELECT r
        FROM Record r
        LEFT JOIN FETCH r.aiAnalysis
        WHERE r.user = :user
          AND r.recordDateTime >= :start
          AND r.recordDateTime < :end
        ORDER BY r.recordDateTime
        """)
    List<Record> findCalendarRecords(
            @Param("user") User user,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );

    List<Record> findAllByStatusAndCreatedAtBefore(
            RecordStatus status,
            LocalDateTime createdAt
    );
}