import React from 'react'
import AppLayout from '@/layouts/AppLayout'
import Card from '@/shared/ui/Card'
import { Link } from 'react-router-dom'
import { useProfileCompletion } from '../../profile/hooks/useCompletion'

export default function Dashboard() {
  const { data: completion } = useProfileCompletion()

  return (
    <AppLayout>
      <div className="max-w-4xl mx-auto p-4 space-y-4">
        <Card>
          <h1 className="text-2xl">Welcome</h1>
          <p className="mt-2">Welcome to Medicheck. This is your dashboard.</p>
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card>
            <h2 className="text-lg">Profile completion</h2>
            <p className="mt-2">Track your profile completeness and health status.</p>
            <div className="mt-4">
              <Link to="/profile" className="text-indigo-600">Open profile</Link>
            </div>
            <div className="mt-4">
              <strong>{completion?.overall ?? '—'}%</strong>
              <div className="text-sm text-gray-600">{completion?.completed ?? 0}/{completion?.total ?? 0} sections completed</div>
            </div>
          </Card>

          <Card>
            <h2 className="text-lg">Quick actions</h2>
            <ul className="mt-2 list-disc list-inside text-sm">
              <li>Update personal info</li>
              <li>Add recent measurement</li>
              <li>Upload lab report</li>
            </ul>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <h3 className="text-sm">Recent activity</h3>
            <p className="text-xs mt-1">None</p>
          </Card>
          <Card>
            <h3 className="text-sm">Upcoming assessments</h3>
            <p className="text-xs mt-1">None</p>
          </Card>
          <Card>
            <h3 className="text-sm">Health score</h3>
            <p className="text-xs mt-1">N/A</p>
          </Card>
        </div>
      </div>
    </AppLayout>
  )
}
