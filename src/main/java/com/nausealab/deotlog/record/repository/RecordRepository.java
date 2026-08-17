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

    List<Record> findByUserOrderByRecordDateTimeDesc(User user);

    List<Record> findByUserAndRecordDateTimeBetween(
            User user,
            LocalDateTime start,
            LocalDateTime end
    );

    Optional<Record> findByRecordIdAndUser(
            Long recordId,
            User user
    );

    @Query("""
        SELECT r
        FROM Record r
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