import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Spin, Typography } from 'antd';
import { UserOutlined, CheckCircleOutlined, ClockCircleOutlined, PercentageOutlined } from '@ant-design/icons';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line
} from 'recharts';
import { useTranslation } from 'react-i18next';
import axios from 'axios';

const { Title } = Typography;

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#a4de6c', '#d0ed57'];

interface SummaryStats {
  total: number;
  employed: number;
  pending: number;
  employment_rate: number;
}

interface RegionStat {
  region: string;
  count: number;
}

interface SpecialtyStat {
  specialty: string;
  count: number;
}

interface YearStat {
  year: string;
  total: number;
  employed: number;
}

const AdminStatisticsPage: React.FC = () => {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState<SummaryStats>({ total: 0, employed: 0, pending: 0, employment_rate: 0 });
  const [regions, setRegions] = useState<RegionStat[]>([]);
  const [specialties, setSpecialties] = useState<SpecialtyStat[]>([]);
  const [years, setYears] = useState<YearStat[]>([]);

  useEffect(() => {
    const fetchStatistics = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem('token');
        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, regionRes, specialtyRes, yearRes] = await Promise.all([
          axios.get('http://localhost:8000/statistics/summary', { headers }),
          axios.get('http://localhost:8000/statistics/by-region', { headers }),
          axios.get('http://localhost:8000/statistics/by-specialty', { headers }),
          axios.get('http://localhost:8000/statistics/by-year', { headers })
        ]);
        
        setSummary(summaryRes.data);
        setRegions(regionRes.data);
        setSpecialties(specialtyRes.data);
        setYears(yearRes.data);
      } catch (error) {
        console.error("Failed to fetch statistics", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStatistics();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div style={{ animation: 'fadeIn 0.5s ease' }}>
      <Title level={2} style={{ color: '#064e3b', marginBottom: 24 }}>{t('statistics')}</Title>

      {/* BLOCK 1 - Summary Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={t('total_graduates')}
              value={summary.total}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#064e3b', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={t('employed')}
              value={summary.employed}
              prefix={<CheckCircleOutlined />}
              valueStyle={{ color: '#10b981', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={t('pending')}
              value={summary.pending}
              prefix={<ClockCircleOutlined />}
              valueStyle={{ color: '#f59e0b', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} md={6}>
          <Card bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <Statistic
              title={t('employment_rate')}
              value={summary.employment_rate}
              precision={2}
              suffix="%"
              prefix={<PercentageOutlined />}
              valueStyle={{ color: '#3b82f6', fontWeight: 'bold' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[24, 24]}>
        {/* BLOCK 2 - Employment by Region */}
        <Col xs={24} lg={12}>
          <Card title={t('by_region')} bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart
                  data={regions}
                  layout="vertical"
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={false} />
                  <XAxis type="number" />
                  <YAxis dataKey="region" type="category" width={100} tick={{ fontSize: 12 }} />
                  <RechartsTooltip cursor={{ fill: 'rgba(16, 185, 129, 0.1)' }} />
                  <Bar dataKey="count" fill="#10b981" name={t('graduates_count')} radius={[0, 4, 4, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* BLOCK 3 - Top Specialties */}
        <Col xs={24} lg={12}>
          <Card title={t('by_specialty')} bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)', height: '100%' }}>
            <div style={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    data={specialties}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    fill="#8884d8"
                    paddingAngle={2}
                    dataKey="count"
                    nameKey="specialty"
                    label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {specialties.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <RechartsTooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>

        {/* BLOCK 4 - Employment by Year */}
        <Col xs={24}>
          <Card title={t('by_year')} bordered={false} style={{ borderRadius: 12, boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}>
            <div style={{ width: '100%', height: 350 }}>
              <ResponsiveContainer>
                <LineChart
                  data={years}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <RechartsTooltip />
                  <Legend />
                  <Line 
                    type="monotone" 
                    dataKey="total" 
                    name={t('total_graduates')} 
                    stroke="#8884d8" 
                    strokeWidth={3} 
                    activeDot={{ r: 8 }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="employed" 
                    name={t('employed')} 
                    stroke="#10b981" 
                    strokeWidth={3} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </Card>
        </Col>
      </Row>
      
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default AdminStatisticsPage;
