// 더미 리포트 데이터
export const dummyReports = [
  {
    id: 1,
    report_name: '리포트1',
    report_type: '정기',
    created_at: '2024-01-15 09:00:00',
    updated_at: '2024-01-15 09:00:00'
  },
  {
    id: 2,
    report_name: '리포트2',
    report_type: '비정기',
    created_at: '2024-01-20 14:30:00',
    updated_at: '2024-01-20 14:30:00'
  },
  {
    id: 3,
    report_name: '리포트3',
    report_type: '정기',
    created_at: '2024-02-01 10:15:00',
    updated_at: '2024-02-01 10:15:00'
  },
  {
    id: 4,
    report_name: '리포트4',
    report_type: '정기',
    created_at: '2024-02-15 11:45:00',
    updated_at: '2024-02-15 11:45:00'
  },
  {
    id: 5,
    report_name: '리포트5',
    report_type: '비정기',
    created_at: '2024-02-28 16:20:00',
    updated_at: '2024-02-28 16:20:00'
  },
  {
    id: 6,
    report_name: '리포트6',
    report_type: '정기',
    created_at: '2024-03-01 08:30:00',
    updated_at: '2024-03-01 08:30:00'
  },
  {
    id: 7,
    report_name: '리포트7',
    report_type: '비정기',
    created_at: '2024-03-10 13:45:00',
    updated_at: '2024-03-10 13:45:00'
  },
  {
    id: 8,
    report_name: '리포트8',
    report_type: '정기',
    created_at: '2024-03-15 09:00:00',
    updated_at: '2024-03-15 09:00:00'
  },
  {
    id: 9,
    report_name: '리포트9',
    report_type: '비정기',
    created_at: '2024-03-25 15:30:00',
    updated_at: '2024-03-25 15:30:00'
  },
  {
    id: 10,
    report_name: '리포트10',
    report_type: '정기',
    created_at: '2024-04-01 10:00:00',
    updated_at: '2024-04-01 10:00:00'
  },
  {
    id: 11,
    report_name: '리포트11',
    report_type: '정기',
    created_at: '2024-04-15 11:15:00',
    updated_at: '2024-04-15 11:15:00'
  },
  {
    id: 12,
    report_name: '리포트12',
    report_type: '비정기',
    created_at: '2024-04-22 14:45:00',
    updated_at: '2024-04-22 14:45:00'
  },
  {
    id: 13,
    report_name: '리포트13',
    report_type: '정기',
    created_at: '2024-05-01 08:45:00',
    updated_at: '2024-05-01 08:45:00'
  },
  {
    id: 14,
    report_name: '리포트14',
    report_type: '비정기',
    created_at: '2024-05-10 16:30:00',
    updated_at: '2024-05-10 16:30:00'
  },
  {
    id: 15,
    report_name: '리포트15',
    report_type: '정기',
    created_at: '2024-05-15 09:30:00',
    updated_at: '2024-05-15 09:30:00'
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