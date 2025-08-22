// 더미 리포트 데이터
export const dummyReports = [
  {
    id: 1,
    report_name: '25. 08. 12 정기 리포트',
    report_type: '정기',
    created_at: '2025-08-12 09:00:00',
    updated_at: '2025-08-12 09:00:00'
  },
  {
    id: 2,
    report_name: '내용 입력',
    report_type: '비정기',
    created_at: null,
    updated_at: null
  },
  {
    id: 3,
    report_name: '내용 입력',
    report_type: '정기',
    created_at: null,
    updated_at: null
  },
  {
    id: 4,
    report_name: '25. 08. 05 정기 리포트',
    report_type: '정기',
    created_at: '2025-08-05 10:00:00',
    updated_at: '2025-08-05 10:00:00'
  },
  {
    id: 5,
    report_name: '25. 07. 29 비정기 리포트',
    report_type: '비정기',
    created_at: '2025-07-29 14:30:00',
    updated_at: '2025-07-29 14:30:00'
  },
  {
    id: 6,
    report_name: '25. 07. 22 정기 리포트',
    report_type: '정기',
    created_at: '2025-07-22 09:15:00',
    updated_at: '2025-07-22 09:15:00'
  },
  {
    id: 7,
    report_name: '25. 07. 15 정기 리포트',
    report_type: '정기',
    created_at: '2025-07-15 11:00:00',
    updated_at: '2025-07-15 11:00:00'
  },
  {
    id: 8,
    report_name: '25. 07. 08 비정기 리포트',
    report_type: '비정기',
    created_at: '2025-07-08 16:45:00',
    updated_at: '2025-07-08 16:45:00'
  },
  {
    id: 9,
    report_name: '25. 07. 01 정기 리포트',
    report_type: '정기',
    created_at: '2025-07-01 08:30:00',
    updated_at: '2025-07-01 08:30:00'
  },
  {
    id: 10,
    report_name: '25. 06. 24 정기 리포트',
    report_type: '정기',
    created_at: '2025-06-24 10:20:00',
    updated_at: '2025-06-24 10:20:00'
  },
  {
    id: 11,
    report_name: '25. 06. 17 비정기 리포트',
    report_type: '비정기',
    created_at: '2025-06-17 13:15:00',
    updated_at: '2025-06-17 13:15:00'
  },
  {
    id: 12,
    report_name: '25. 06. 10 정기 리포트',
    report_type: '정기',
    created_at: '2025-06-10 09:45:00',
    updated_at: '2025-06-10 09:45:00'
  },
  {
    id: 13,
    report_name: '25. 06. 03 정기 리포트',
    report_type: '정기',
    created_at: '2025-06-03 11:30:00',
    updated_at: '2025-06-03 11:30:00'
  },
  {
    id: 14,
    report_name: '25. 05. 27 비정기 리포트',
    report_type: '비정기',
    created_at: '2025-05-27 15:20:00',
    updated_at: '2025-05-27 15:20:00'
  },
  {
    id: 15,
    report_name: '25. 05. 20 정기 리포트',
    report_type: '정기',
    created_at: '2025-05-20 08:15:00',
    updated_at: '2025-05-20 08:15:00'
  },
  {
    id: 16,
    report_name: '25. 05. 13 정기 리포트',
    report_type: '정기',
    created_at: '2025-05-13 10:50:00',
    updated_at: '2025-05-13 10:50:00'
  },
  {
    id: 17,
    report_name: '25. 05. 06 비정기 리포트',
    report_type: '비정기',
    created_at: '2025-05-06 14:25:00',
    updated_at: '2025-05-06 14:25:00'
  },
  {
    id: 18,
    report_name: '25. 04. 29 정기 리포트',
    report_type: '정기',
    created_at: '2025-04-29 09:10:00',
    updated_at: '2025-04-29 09:10:00'
  },
  {
    id: 19,
    report_name: '25. 04. 22 정기 리포트',
    report_type: '정기',
    created_at: '2025-04-22 12:40:00',
    updated_at: '2025-04-22 12:40:00'
  },
  {
    id: 20,
    report_name: '25. 04. 15 비정기 리포트',
    report_type: '비정기',
    created_at: '2025-04-15 16:55:00',
    updated_at: '2025-04-15 16:55:00'
  }
];

// 더미 리포트 API 응답 형태
export const getDummyReportsResponse = () => ({
  success: true,
  data: dummyReports,
  message: '리포트 목록을 성공적으로 가져왔습니다.'
});

// 특정 리포트 조회
export const getDummyReportById = (id) => {
  const report = dummyReports.find(report => report.id === id);
  return {
    success: true,
    data: report,
    message: '리포트를 성공적으로 가져왔습니다.'
  };
}; 