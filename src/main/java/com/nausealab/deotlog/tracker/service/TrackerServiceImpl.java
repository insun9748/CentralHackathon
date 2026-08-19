package com.nausealab.deotlog.tracker.service;

import com.nausealab.deotlog.category.entity.PregnancyWeekContent;
import com.nausealab.deotlog.category.entity.PregnancyWeekInfo;
import com.nausealab.deotlog.category.entity.SectionType;
import com.nausealab.deotlog.category.repository.PregnancyWeekContentRepository;
import com.nausealab.deotlog.category.repository.PregnancyWeekInfoRepository;
import com.nausealab.deotlog.global.exception.CustomException;
import com.nausealab.deotlog.global.exception.ErrorCode;
import com.nausealab.deotlog.record.entity.Record;
import com.nausealab.deotlog.record.repository.RecordRepository;
import com.nausealab.deotlog.tracker.dto.response.CalendarDayResponse;
import com.nausealab.deotlog.tracker.dto.response.CalendarResponse;
import com.nausealab.deotlog.tracker.dto.response.TrackerResponse;
import com.nausealab.deotlog.tracker.dto.response.WeekContentResponse;
import com.nausealab.deotlog.user.entity.User;
import com.nausealab.deotlog.user.repository.UserRepository;
import com.nausealab.deotlog.user.util.PregnancyWeekCalculator;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TrackerServiceImpl implements TrackerService {

    private final UserRepository userRepository;
    private final PregnancyWeekInfoRepository pregnancyWeekInfoRepository;
    private final PregnancyWeekContentRepository pregnancyWeekContentRepository;
    private final PregnancyWeekCalculator pregnancyWeekCalculator;
    private final RecordRepository recordRepository;

    @Override
    public TrackerResponse getTracker(Long userId) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        if (user.getDueDate() == null) {
            throw new CustomException(ErrorCode.DUE_DATE_NOT_FOUND);
        }

        int currentWeek =
                pregnancyWeekCalculator.calculate(user.getDueDate());

        PregnancyWeekInfo info =
                pregnancyWeekInfoRepository.findById(currentWeek)
                        .orElseThrow(() ->
                                new CustomException(
                                        ErrorCode.PREGNANCY_WEEK_INFO_NOT_FOUND
                                ));

        List<WeekContentResponse> foodInfo =
                getContents(info.getWeek(), SectionType.FOOD);

        List<WeekContentResponse> caution =
                getContents(info.getWeek(), SectionType.CAUTION);

        List<WeekContentResponse> bodyChange =
                getContents(info.getWeek(), SectionType.BODY_CHANGE);

        return TrackerResponse.builder()
                .currentWeek(currentWeek)
                .stage(getStage(currentWeek))
                .foodInfo(foodInfo)
                .caution(caution)
                .bodyChange(bodyChange)
                .build();
    }

    private List<WeekContentResponse> getContents(
            Integer week,
            SectionType section
    ) {

        return pregnancyWeekContentRepository
                .findByPregnancyWeekInfo_WeekAndSectionOrderByDisplayOrderAsc(
                        week,
                        section
                )
                .stream()
                .map(this::toWeekContentResponse)
                .toList();
    }

    private WeekContentResponse toWeekContentResponse(
            PregnancyWeekContent content
    ) {

        return WeekContentResponse.builder()
                .title(content.getTitle())
                .description(content.getDescription())
                .highlight(content.getHighlight())
                .build();
    }

    private String getStage(int week) {

        if (week <= 13) {
            return "임신 초기";
        }

        if (week <= 27) {
            return "임신 중기";
        }

        return "임신 후기";
    }

    @Override
    public CalendarResponse getCalendar(
            Long userId,
            int year,
            int month
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new CustomException(ErrorCode.USER_NOT_FOUND));

        LocalDate firstDay =
                LocalDate.of(year, month, 1);

        LocalDate lastDay =
                firstDay.withDayOfMonth(firstDay.lengthOfMonth());

        List<Record> records =
                recordRepository.findCalendarRecords(
                        user,
                        firstDay.atStartOfDay(),
                        lastDay.plusDays(1).atStartOfDay()
                );

        Map<LocalDate, List<Record>> grouped =
                records.stream()
                        .collect(Collectors.groupingBy(
                                r -> r.getRecordDateTime().toLocalDate()
                        ));

        List<CalendarDayResponse> days = new ArrayList<>();

        for (LocalDate date = firstDay;
             !date.isAfter(lastDay);
             date = date.plusDays(1)) {

            List<Record> dayRecords =
                    grouped.getOrDefault(date, List.of());

            Double average = null;

            if (!dayRecords.isEmpty()) {

                average =
                        dayRecords.stream()
                                .mapToInt(r ->
                                        r.getIntensity().getLevel())
                                .average()
                                .orElse(0);
            }

            days.add(
                    CalendarDayResponse.builder()
                            .date(date)
                            .hasRecord(!dayRecords.isEmpty())
                            .averageIntensity(average)
                            .build()
            );
        }

        return CalendarResponse.builder()
                .year(year)
                .month(month)
                .days(days)
                .build();
    }
}