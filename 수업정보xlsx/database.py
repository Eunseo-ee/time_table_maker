import pandas as pd
import mysql.connector

# MySQL 연결 설정
connection = mysql.connector.connect(
    host='localhost',  # MySQL 서버 주소
    user='root',  # MySQL 사용자 이름
    password='0624',  # MySQL 비밀번호
    database='SchoolDB',  # 데이터베이스 이름
    charset='utf8mb4'  # 문자셋 설정
)

# 엑셀 파일 경로
excel_file_path = '조형대학.xlsx'

# 엑셀 파일에서 데이터 읽기
data = pd.read_excel(excel_file_path)

# 엑셀 파일의 컬럼 이름을 테이블 컬럼 이름과 일치시키기 위해 변경
data = data.rename(columns={'couseName': 'courseName'})

# 데이터프레임의 컬럼 이름 출력
print("데이터프레임의 컬럼 이름:", data.columns)

# 수업 시간 정보를 파싱하는 함수 정의
def parse_course_times(course_hours):
    """수업 시간 정보를 파싱하여 요일과 시작/종료 교시 리스트로 반환"""
    time_slots = []

    time_segments = course_hours.split(",")  # 여러 요일과 교시를 ','로 분리
    for segment in time_segments:
        segment = segment.strip()  # 앞뒤 공백 제거
        parts = segment.split("(")  # "월(1~2)"에서 "월"과 "1~2"로 나눔
        if len(parts) == 2:
            day_of_week = parts[0].strip()  # 요일
            periods = parts[1].replace(")", "").strip()  # 교시 범위 "1~2"
            period_range = periods.split("~")

            if len(period_range) == 2:
                start_period = float(period_range[0])
                end_period = float(period_range[1])
                time_slots.append((day_of_week, start_period, end_period))
            elif len(period_range) == 1:
                start_period = float(period_range[0])
                time_slots.append((day_of_week, start_period, start_period))

    return time_slots

# MySQL 커서 생성
cursor = connection.cursor()

# 데이터 삽입 쿼리 (id는 자동 증가이므로 제외)
insert_query = """
    INSERT INTO courses (department_id, courseCode, courseName, courseNumber, division, credit, capacity, professorName, classroom, day_of_week, start_period, end_period)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# 엑셀 데이터에서 각 행을 읽어와서 테이블에 삽입
for index, row in data.iterrows():
    # 수정된 컬럼명으로 확인
    if 'department_id' in data.columns and 'courseHours' in data.columns:
        course_hours = row['courseHours']
        time_slots = parse_course_times(course_hours)

        # 파싱된 시간 정보를 각각의 레코드로 삽입
        for day_of_week, start_period, end_period in time_slots:
            cursor.execute(insert_query, (
                row['department_id'],
                row['courseCode'],
                row['courseName'],
                row['courseNumber'],
                row['division'],
                row['credit'],
                row['capacity'],
                row['professorName'],
                row['classroom'],
                day_of_week,
                start_period,
                end_period
            ))
    else:
        print("필수 컬럼('department_id' 또는 'courseHours')이 데이터프레임에 존재하지 않습니다.")
        break

# 변경사항 저장
connection.commit()

# 연결 종료
cursor.close()
connection.close()

print("데이터 삽입 완료!")
