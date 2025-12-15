import Dashboard from '@/components/gtd/Dashboard';

export const metadata = {
    title: 'GTD Dashboard | Specidiee',
    description: 'Get Things Done',
};

export default function GTDPage() {
    return (
        <div className="min-h-screen bg-white dark:bg-gray-900 text-black dark:text-white">
            <Dashboard />
        </div>
    );
}
