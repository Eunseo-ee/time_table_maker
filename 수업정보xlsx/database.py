import pandas as pd
import mysql.connector

# 1. 엑셀 파일을 읽기
df = pd.read_excel('조형대학.xlsx')  # 엑셀 파일 경로

# 2. 데이터베이스 연결
conn = mysql.connector.connect(
    host="localhost",
    user="root",    # 본인의 DB 유저명
    password="0624",# 본인의 DB 패스워드
    database="SchoolDB"  # 본인의 DB 이름
)
cursor = conn.cursor()

# 3. INSERT 쿼리 정의 (자리표시자 %s 사용)
insert_query = """
    INSERT INTO courses (department_id, courseCode, couseName, courseNumber, division, courseHours, capacity, professorName, classroom)
    VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s)
"""

# 4. 엑셀 데이터를 리스트로 변환 (SQL에 맞게)
course_data = df[['department_id', 'courseCode', 'couseName', 'courseNumber', 'division', 'courseHours', 'capacity', 'professorName', 'classroom']].values.tolist()

# 5. 데이터베이스에 여러 레코드 한 번에 삽입
cursor.executemany(insert_query, course_data)

# 6. 변경사항 저장
conn.commit()

# 7. 연결 종료
cursor.close()
conn.close()

print("데이터베이스에 성공적으로 삽입되었습니다.")