#!/bin/bash

# Vercel 환경 변수를 .env.local로 가져오는 스크립트
# 사용법: ./scripts/pull-env.sh

echo "🔍 Vercel 프로젝트 목록 확인 중..."

# 프로젝트 목록 확인
vercel projects ls

echo ""
echo "📝 위 목록에서 프로젝트 이름을 확인한 후,"
echo "다음 명령어를 실행하세요:"
echo ""
echo "vercel env pull .env.local --yes"
echo ""
echo "또는 특정 프로젝트를 지정하려면:"
echo "vercel env pull .env.local --project=프로젝트이름 --yes"

