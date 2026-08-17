package com.nausealab.deotlog.record.scheduler;

import com.nausealab.deotlog.record.entity.Record;
import com.nausealab.deotlog.record.entity.RecordStatus;
import com.nausealab.deotlog.record.repository.RecordRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Slf4j
@Component
@RequiredArgsConstructor
public class RecordScheduler {

    private final RecordRepository recordRepository;

    /**
     * 매일 새벽 1시에 실행
     */
    @Scheduled(cron = "0 0 1 * * *")
    @Transactional
    public void completeExpiredRecords() {

        LocalDateTime target =
                LocalDateTime.now().minusDays(3);

        List<Record> records =
                recordRepository.findAllByStatusAndCreatedAtBefore(
                        RecordStatus.DRAFT,
                        target
                );

        records.forEach(Record::complete);

        log.info("{}개의 기록을 자동 완료했습니다.", records.size());
    }
}